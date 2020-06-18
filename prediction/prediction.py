from flask import Flask,jsonify, request
from flask_cors import CORS, cross_origin
import pandas as pd
import rpy2
from rpy2.robjects.packages import SignatureTranslatedAnonymousPackage

app = Flask(__name__)
CORS(app)

@app.route("/", methods=['GET', 'POST'])
@cross_origin()
def output():    
    string = """
    test <- function(){
        ## Toxicities: survival, feeding tube, aspiration
        # Outputs: predicted toxicity probability for each patient, 
        # predicted survival probability for each patient, 
        # weight of each variable in each risk prediction model 
        ## Adds therapy as a predictor

        ## load libraries
        #library(survival)
        #library(dplyr)
        #library(purrr)


        if(!require("pacman")) install.packages("pacman")
        pacman::p_load(pacman, survival, tidyverse)

        ### set file directory
        ## Modify this to correct file location 
        #file.dir <- "/users/shannonmck/Box/SMART/SMART database/Training set_version1.3/"

        ### load data
        #OPC <- read.csv(paste0(file.dir, 
        #                       "Anonymized_644.Updated_cleaned_v1.3.1.csv"))

        OPC <- read.csv("../data/newdata.csv")
        #length(unique(OPC$Dummy.ID))

        ###############################
        ##### Clean clinical data #####
        ###############################
        ## remove duplicates
        #take the values to a dataframe
        OPC_final <- OPC
        #takin first to forty colums
        OPC_final_clinic <- OPC_final[, c(1:40)]
        #making some new values using mutate
        OPC_final_clinic <- mutate(OPC_final_clinic, 
                                   ajcc_stage = as.character(AJCC.8th.edition),
                                   #t3 and t4 will be 1 and everything will be 0
                                   T.category34 = ifelse(T.category == "T3" | T.category == "T4", 1, 0),
                                   # n2 and n3 will be 1 and everything will be 0
                                   N.category23 = ifelse(N.category == "N2" | N.category == "N3", 1, 0),
                                   # if white/caucasion will be white else all will be other
                                   white = ifelse(Race == "White/Caucasion", "White", "Other"),
                                   smoke = Smoking.status.at.Diagnosis..Never.Former.Current.,
                                   # take that as numeric if value N/A make it not a number or NA
                                   pack_year = ifelse(Smoking.status..Packs.Year. == "N/A", NA, as.numeric(Smoking.status..Packs.Year.)),
                                   # if smoke is never then make 0
                                   pack_year = ifelse(smoke == "Never", 0, pack_year),
                                   #for na took the mean of all 
                                   pack_year = ifelse(is.na(pack_year) == TRUE, mean(pack_year, na.rm = TRUE), pack_year),
                                   age = Age.at.Diagnosis..Calculated.,
                                   neck_boost = Neck.boost..Y.N.,
                                   neck_dissection = Neck.Disssection.after.IMRT..Y.N.,
                                   #changed the name of the value for ease i guess 
                                   #made it as a factor meaning we can count how many are BOTs, Tonsils etc
                                   tumor_subsite = as.factor(ifelse(!(Tumor.subsite..BOT.Tonsil.Soft.Palate.Pharyngeal.wall.GPS.NOS.%in%c("BOT","Tonsil")),"Other",
                                                                    as.character(Tumor.subsite..BOT.Tonsil.Soft.Palate.Pharyngeal.wall.GPS.NOS.)))
        )

        #write.csv(OPC_final_clinic, file="opc_final_clinic_after_mutation.csv")

        #renaming the values 

        levels(OPC_final_clinic$smoke )[levels(OPC_final_clinic$smoke )=="Formar"] <- "Former"
        levels(OPC_final_clinic$T.category)[levels(OPC_final_clinic$T.category)=="Tis"] <- "T1"
        levels(OPC_final_clinic$T.category)[levels(OPC_final_clinic$T.category)=="Tx"] <- "T1"

        #write.csv(OPC_final_clinic, file="after_leveling.csv")

        ## 6 blanks for feeding tube - omit
        #removing feeding tube that does not have any value
        OPC_final_clinic <- OPC_final_clinic[OPC_final_clinic$Feeding.tube.6m!="",]
        #write.csv(OPC_final_clinic, file="omitting.csv")
        #as we removed some values above, we fixed the counter for therapeutic combination
        OPC_final_clinic$Therapeutic.combination <- droplevels(OPC_final_clinic$Therapeutic.combination)
        #write.csv(OPC_final_clinic, file="theraputicCombination.csv")
        OPC_final_clinic <- mutate(OPC_final_clinic,
                                   #if feedind tube is N then set 0 otherwise 1
                                   feeding_tube = ifelse(Feeding.tube.6m =="N",0,1),
                                   #aspiration is N then set 0 otherwise 1
                                   aspiration = ifelse(Aspiration.rate.Y.N.=="N",0,1),
                                   #neck_booxt, neck_dissection and hpv are made as factors for counting
                                   neck_boost = factor(OPC_final_clinic$neck_boost),
                                   neck_dissection = factor(OPC_final_clinic$neck_dissection),
                                   HPV.P16.status = factor(OPC_final_clinic$HPV.P16.status))

        #levels(OPC_final_clinic$Therapeutic.combination)
        ## select covariates to include
        rel_vars <- c("Therapeutic.combination","Gender", "age", "HPV.P16.status", "T.category", "N.category",
                      "smoke", "white", "pack_year","tumor_subsite","neck_boost","neck_dissection")

        ########################################
        ##### Feeding tube: binary outcome #####
        ########################################

        ## Relevel factor variables to yield positive coefficients
        #releveling - making the IC+R as the first level
        OPC_final_clinic$Therapeutic.combination <- relevel(OPC_final_clinic$Therapeutic.combination,"IC+Radiation alone")
        #levels(OPC_final_clinic$Therapeutic.combination)
        #write.csv(OPC_final_clinic, file="feedingTubeBinaryOutcome.csv")
        #factoring gender
        OPC_final_clinic$Gender <- factor(OPC_final_clinic$Gender,levels=levels(factor(OPC_final_clinic$Gender))[2:1])
        #print(factor(OPC_final_clinic$Gender,levels=levels(factor(OPC_final_clinic$Gender))[2:1]))
        #levels(OPC_final_clinic$neck_boost)
        #factoring smoke and then make Former as first level
        OPC_final_clinic$smoke <- factor(OPC_final_clinic$smoke)
        OPC_final_clinic$smoke <- relevel(OPC_final_clinic$smoke,"Former")
        #factoring white
        OPC_final_clinic$white <- factor(OPC_final_clinic$white,levels=c("White","Other"))
        #making Tonsile and Y as first levels
        OPC_final_clinic$tumor_subsite <- relevel(OPC_final_clinic$tumor_subsite,"Tonsil")
        OPC_final_clinic$neck_boost <- relevel(OPC_final_clinic$neck_boost,"Y")

        ## Logistic regression for feeding tube outcome
        ## Logistic regression model with main effects
        #paste0 concats values without any space in between them
        #collapse means what will add in between each results
        #creating the formula
        fmla_ft <- as.formula(paste0("feeding_tube ~",paste0(rel_vars,collapse="+")))
        #print(fmla_ft)
        #applying generalized linear model
        #glm(formula, data, family) -- need to find the mathemetics for JS
        fit_ft <- glm(fmla_ft, data=OPC_final_clinic, family="binomial")

        ######################################
        ##### Aspiration: binary outcome #####
        ######################################
        #releveling and factoring
        OPC_final_clinic$Therapeutic.combination <- relevel(OPC_final_clinic$Therapeutic.combination,"Radiation alone")
        OPC_final_clinic$white <- factor(OPC_final_clinic$white,levels=c("Other","White"))
        OPC_final_clinic$tumor_subsite <- relevel(OPC_final_clinic$tumor_subsite,"BOT")
        ## Logistic regression model with main effects
        fmla_asp <- as.formula(paste0("aspiration ~",paste0(rel_vars,collapse="+")))
        fit_asp <- glm(fmla_asp,data=OPC_final_clinic,family="binomial")
        ## note high correlation between 2 binary outcomes 

        ######################################
        ##### Survival: censored outcome #####
        ######################################
        ### outcome
        # 1) overall - overall survival (OS)
        #	2) PFS - progression (local, regional, and distant control) free survival 

        ## Add survival time and indicator variables to dataset for OS 
        OPC_final_surv <- OPC_final_clinic
        OPC_final_surv <- mutate(OPC_final_surv, 
                                 survtime = OS..Calculated.,
                                 survind = 1 - Overall.Survival..1.alive..0.dead.)
        ## remove extraneous variables for analysis
        OPC_final_surv <- select(OPC_final_surv, Dummy.ID, rel_vars,survtime,survind)

        ## Relevel factor variables to yield positive coefficients
        OPC_final_surv$Therapeutic.combination <- relevel(OPC_final_surv$Therapeutic.combination,"IC+Radiation alone")
        OPC_final_surv$white <- factor(OPC_final_surv$white,levels=c("White","Other"))
        OPC_final_surv$Gender <- relevel(OPC_final_surv$Gender,"Female")
        OPC_final_surv$HPV.P16.status <- relevel(OPC_final_surv$HPV.P16.status,"Unknown")
        OPC_final_surv$smoke <- relevel(OPC_final_surv$smoke,"Never")
        OPC_final_surv$tumor_subsite <- relevel(OPC_final_surv$tumor_subsite,"BOT")
        OPC_final_surv$neck_dissection <- relevel(OPC_final_surv$neck_dissection,"N")
        OPC_final_surv$T.category <- factor(OPC_final_surv$T.category)
        levels(OPC_final_surv$T.category) <- levels(OPC_final_surv$T.category)[c(4:1)]
        OPC_final_surv$N.category <- factor(OPC_final_surv$N.category)
        OPC_final_surv$N.category <- relevel(OPC_final_surv$N.category,"N1")

        # Cox proportional hazards models - standard covariates
        #need to learn about coxph and basehaz and exp
        fmla_surv <- as.formula(paste0("Surv(survtime, survind) ~",paste0(rel_vars,collapse="+")))
        fit_os <- coxph(fmla_surv, data=OPC_final_surv)

        ## baseline hazard 
        #1. took the baseline hazards that have time less than 60
        #2. then took the hazards from them 
        #3. finally took the max
        h0_5yr <- max(basehaz(fit_os, centered=FALSE)[basehaz(fit_os)$time<=60,]$haz)
        #print(basehaz(fit_os, centered=FALSE)[basehaz(fit_os)$time<=60,]$haz)
        baseline_haz <- exp(-h0_5yr)

        ### design matrix
        #model matrix make the factor values as values in a matrix
        design.OPC <- data.frame(model.matrix(~Therapeutic.combination,data=OPC_final_surv)[,2:4],
                                 t(t(model.matrix(~Gender, data=OPC_final_surv)[,2])),
                                 OPC_final_surv$age, 
                                 model.matrix(~HPV.P16.status+T.category+N.category+smoke+white, data=OPC_final_surv)[,2:12],
                                 OPC_final_surv$pack_year,
                                 model.matrix(~tumor_subsite+neck_boost+neck_dissection, data=OPC_final_surv)[,2:5])
        #head(model.matrix(~Gender, data=OPC_final_surv)[,2])
        #head(t(t(model.matrix(~Gender, data=OPC_final_surv)[,2])))

        ## predictions for each participant 
        # %*% is matrix multiplication
        # exp is exponential function
        preds_os <- exp(-h0_5yr)^exp((as.matrix(design.OPC))%*%(matrix(fit_os$coefficients)))

        #same process
        ## Repeat for progression-free survival outcome
        OPC_final_pfs <- OPC_final_clinic
        OPC_final_pfs <- mutate(OPC_final_clinic, 
                                #pmin sends the minimum value between the two
                                survtime = pmin(Locoregional.control..Time., FDM..months.),
                                survind = ifelse((Locoregional.control..Time. == survtime)*
                                                   (1 - Locoregional.Control.1.Control.0.Failure.) +
                                                   (FDM..months. == survtime)*(1 - Distant.Control..1.no.DM..0.DM.) > 0 , 1, 0))
        OPC_final_pfs <- select(OPC_final_pfs, Dummy.ID, rel_vars,survtime,survind)

        ## Relevel factor variables to yield positive coefficients
        OPC_final_pfs$Therapeutic.combination <- relevel(OPC_final_pfs$Therapeutic.combination,"IC+Radiation alone")
        OPC_final_pfs$Gender <- relevel(OPC_final_pfs$Gender,"Female")
        OPC_final_pfs$white <- relevel(OPC_final_pfs$white,"White")
        OPC_final_pfs$HPV.P16.status <- relevel(OPC_final_pfs$HPV.P16.status,"Unknown")
        OPC_final_pfs$smoke <- relevel(OPC_final_pfs$smoke,"Never")
        OPC_final_pfs$tumor_subsite <- relevel(OPC_final_pfs$tumor_subsite,"Other")
        OPC_final_pfs$neck_dissection <- relevel(OPC_final_pfs$neck_dissection,"N")
        OPC_final_pfs$T.category <- factor(OPC_final_pfs$T.category)
        levels(OPC_final_pfs$T.category) <- levels(OPC_final_pfs$T.category)[c(4:1)]
        OPC_final_pfs$N.category <- factor(OPC_final_pfs$N.category)

        ## fit Cox proportional hazards model
        fit_pfs <- coxph(fmla_surv, data=OPC_final_pfs)

        ## baseline hazard 
        h0_5yr_pfs <- max(basehaz(fit_pfs, centered=FALSE)[basehaz(fit_pfs)$time<=60,]$haz)
        baseline_haz_pfs <- exp(-h0_5yr_pfs)

        ### design matrix
        design.OPC_pfs <- data.frame(model.matrix(~Therapeutic.combination,data=OPC_final_pfs)[,2:4],
                                     t(t(model.matrix(~Gender, data=OPC_final_pfs)[,2])),
                                     OPC_final_pfs$age, 
                                     model.matrix(~HPV.P16.status+T.category+N.category+smoke+white, data=OPC_final_pfs)[,2:12],
                                     OPC_final_pfs$pack_year,
                                     model.matrix(~tumor_subsite+neck_boost+neck_dissection, data=OPC_final_pfs)[,2:5])
        ## predictions for each participant
        preds_pfs <- exp(-h0_5yr_pfs)^exp((as.matrix(design.OPC_pfs))%*%(matrix(fit_pfs$coefficients)))

        ##########################
        ##### Compile Output #####
        ##########################

        final_preds <- data.frame(ID=OPC_final_clinic$Dummy.ID, 
                                  feeding_tube_prob = fit_ft$fitted.values,
                                  aspiration_prob = fit_asp$fitted.values,
                                  overall_survival_5yr_prob = preds_os,
                                  progression_free_5yr_prob = preds_pfs)
        #write.csv(final_preds, file="Risk_preds.csv")

        # final_matrix = data.matrix(final_preds)
        return(final_preds)

        #write.csv(final_weights, file="Risk_pred_model_coefficients.csv")


    }

    """

    powerpack = SignatureTranslatedAnonymousPackage(string, "powerpack")
    result = powerpack.test()
    # ty = str(type(result))    
    # converting the dataframe to a multi-dimentional array
    # initialize multi-array  
    prediction = [ [ 0 for y in range(len(result[0])) ] for x in range( len(result)) ]     
    # print(len(result[0]))
    for i in range(len(result)):
        for j in range(len(result[0])):
            prediction[i][j] = result[i][j]
    
    return jsonify(prediction)

if __name__ == "__main__":
    app.run()